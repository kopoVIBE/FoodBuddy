package com.vibe.yoriview.domain.ocr;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // OCR 입력/출력 디렉토리 경로
    private final String OCR_BASE_PATH = System.getProperty("user.dir");
    private final String PYTHON_SCRIPT_PATH = OCR_BASE_PATH + "/BE/yoriview/ocr/ocr-parser.py";
    private final String INPUT_DIR = OCR_BASE_PATH + "/ocr/input";
    private final String OUTPUT_DIR = OCR_BASE_PATH + "/ocr/output";

    @RequestMapping(value = "/process", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "OCR 서비스가 정상 작동 중입니다.");
        response.put("timestamp", new java.util.Date());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/process")
    public ResponseEntity<?> processReceipt(@RequestParam("image") MultipartFile file) {
        try {
            log.info("OCR 요청 받음: 파일명={}, 크기={}", file.getOriginalFilename(), file.getSize());

            // 1. 디렉토리 생성
            createDirectories();

            // 2. 파일 저장
            String savedFilePath = saveImageFile(file);
            log.info("이미지 파일 저장됨: {}", savedFilePath);

            // 3. Python 스크립트 실행
            ProcessResult processResult = executePythonScript();

            if (!processResult.isSuccess()) {
                log.error("Python 스크립트 실행 실패: {}", processResult.getErrorMessage());
                return ResponseEntity.internalServerError()
                        .body(createErrorResponse("OCR 처리 실패", processResult.getErrorMessage()));
            }

            // 4. 결과 파일 읽기
            Map<String, Object> ocrResult = readOcrResult();

            if (ocrResult == null) {
                return ResponseEntity.internalServerError()
                        .body(createErrorResponse("OCR 결과를 읽을 수 없습니다", "결과 파일이 생성되지 않았습니다"));
            }

            // 5. 응답 형식 변환
            Map<String, Object> response = convertToResponseFormat(ocrResult, processResult.getOutput());

            log.info("OCR 처리 완료: {}", response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("OCR 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("OCR 처리 중 오류가 발생했습니다", e.getMessage()));
        }
    }

    private void createDirectories() throws IOException {
        Files.createDirectories(Paths.get(INPUT_DIR));
        Files.createDirectories(Paths.get(OUTPUT_DIR));
        log.info("OCR 디렉토리 생성 완료: input={}, output={}", INPUT_DIR, OUTPUT_DIR);
    }

    private String saveImageFile(MultipartFile file) throws IOException {
        // 먼저 input 디렉토리의 모든 파일 삭제
        Path inputDirPath = Paths.get(INPUT_DIR);
        if (Files.exists(inputDirPath)) {
            Files.list(inputDirPath)
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            log.info("기존 파일 삭제: {}", path);
                        } catch (IOException e) {
                            log.warn("파일 삭제 실패: {}", path);
                        }
                    });
        }

        // output 디렉토리의 모든 파일도 삭제
        Path outputDirPath = Paths.get(OUTPUT_DIR);
        if (Files.exists(outputDirPath)) {
            Files.list(outputDirPath)
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            log.info("기존 결과 파일 삭제: {}", path);
                        } catch (IOException e) {
                            log.warn("결과 파일 삭제 실패: {}", path);
                        }
                    });
        }

        // 파일 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = "jpg"; // 기본값
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }

        // receipt.확장자 형태로 저장
        String fileName = "receipt." + extension;
        Path filePath = Paths.get(INPUT_DIR, fileName);

        // 새 파일 저장
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        log.info("새 파일 저장됨: {}", filePath);

        return filePath.toString();
    }

    private ProcessResult executePythonScript() {
        try {
            // 절대 경로 사용
            File scriptFile = new File(PYTHON_SCRIPT_PATH);
            if (!scriptFile.exists()) {
                log.error("Python 스크립트 파일을 찾을 수 없습니다: {}", PYTHON_SCRIPT_PATH);
                return new ProcessResult(false, "Python 스크립트 파일을 찾을 수 없습니다", "");
            }

            // Windows와 Unix 환경에서 모두 작동하도록 Python 명령어 설정
            String pythonCommand = System.getProperty("os.name").toLowerCase().contains("win") ? "python" : "python3";

            ProcessBuilder processBuilder = new ProcessBuilder(pythonCommand, PYTHON_SCRIPT_PATH);
            processBuilder.directory(new File(OCR_BASE_PATH));
            processBuilder.redirectErrorStream(true);

            log.info("Python 스크립트 실행 시작: {}", PYTHON_SCRIPT_PATH);
            log.info("작업 디렉토리: {}", OCR_BASE_PATH);
            log.info("Python 명령어: {}", pythonCommand);

            Process process = processBuilder.start();

            // 출력 읽기
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                    log.info("Python 출력: {}", line);
                }
            }

            // 프로세스 완료 대기 (최대 30초)
            boolean finished = process.waitFor(30, java.util.concurrent.TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return new ProcessResult(false, "Python 스크립트 실행 타임아웃", "");
            }

            int exitCode = process.exitValue();
            String outputStr = output.toString();

            log.info("Python 스크립트 완료: exitCode={}, output={}", exitCode, outputStr);

            if (exitCode == 0) {
                return new ProcessResult(true, "", outputStr);
            } else {
                return new ProcessResult(false, "Python 스크립트 실행 오류 (exit code: " + exitCode + "): " + outputStr, outputStr);
            }

        } catch (Exception e) {
            log.error("Python 스크립트 실행 중 예외 발생", e);
            return new ProcessResult(false, "Python 스크립트 실행 예외: " + e.getMessage(), "");
        }
    }

    private Map<String, Object> readOcrResult() {
        try {
            Path resultFilePath = Paths.get(OUTPUT_DIR, "receipt_result.json");

            if (!Files.exists(resultFilePath)) {
                log.error("OCR 결과 파일이 존재하지 않음: {}", resultFilePath);
                return null;
            }

            String jsonContent = Files.readString(resultFilePath);
            log.info("OCR 결과 파일 읽기 완료: {}", jsonContent);

            return objectMapper.readValue(jsonContent, Map.class);

        } catch (Exception e) {
            log.error("OCR 결과 파일 읽기 실패", e);
            return null;
        }
    }

    private Map<String, Object> convertToResponseFormat(Map<String, Object> ocrResult, String pythonOutput) {
        Map<String, Object> response = new HashMap<>();

        response.put("text", pythonOutput);
        response.put("restaurantName", ocrResult.getOrDefault("storeName", "알 수 없는 식당"));
        response.put("address", ocrResult.getOrDefault("address", ""));
        response.put("items", ocrResult.getOrDefault("menuItems", new java.util.ArrayList<>()));
        response.put("total", ocrResult.getOrDefault("totalPrice", 0));

        return response;
    }

    private Map<String, Object> createErrorResponse(String error, String details) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("details", details);
        return errorResponse;
    }





    // 내부 클래스: 프로세스 실행 결과
    private static class ProcessResult {
        private final boolean success;
        private final String errorMessage;
        private final String output;

        public ProcessResult(boolean success, String errorMessage, String output) {
            this.success = success;
            this.errorMessage = errorMessage;
            this.output = output;
        }

        public boolean isSuccess() { return success; }
        public String getErrorMessage() { return errorMessage; }
        public String getOutput() { return output; }
    }
} 