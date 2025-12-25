package com.example.demo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * FrontendRedirectControllerのテストクラス
 *
 * @see FrontendRedirectController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("FrontendRedirectController テスト")
class FrontendRedirectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ========================================
    // GET / テスト
    // ========================================
    @Nested
    @DisplayName("GET /")
    class GetRootPathTest {

        @Test
        @DisplayName("A-001: ルートパスで200 OKが返却される")
        void getRootPath_Returns200OK() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("A-002: Content-Typeがtext/htmlである")
        void getRootPath_ReturnsHtmlContentType() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_HTML));
        }

        @Test
        @DisplayName("A-003: HTMLにVue Dev ServerのURL(localhost:5173)が含まれる")
        void getRootPath_ContainsVueDevServerUrl() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("localhost:5173")));
        }

        @Test
        @DisplayName("A-004: HTMLにタイトル「Spring Boot API Server」が含まれる")
        void getRootPath_ContainsTitle() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Spring Boot API Server")));
        }

        @Test
        @DisplayName("A-005: HTMLに案内メッセージが含まれる")
        void getRootPath_ContainsInfoMessage() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("このサーバーはREST APIのみを提供しています")))
                .andExpect(content().string(containsString("フロントエンドアプリケーションは別サーバーで動作しています")));
        }

        @Test
        @DisplayName("A-006: HTMLにAPIエンドポイント情報が含まれる")
        void getRootPath_ContainsApiEndpointInfo() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("/api/*")));
        }

        @Test
        @DisplayName("A-007: HTMLに「Vueフロントエンドを開く」リンクが含まれる")
        void getRootPath_ContainsVueLink() throws Exception {
            mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Vueフロントエンドを開く")));
        }
    }
}
