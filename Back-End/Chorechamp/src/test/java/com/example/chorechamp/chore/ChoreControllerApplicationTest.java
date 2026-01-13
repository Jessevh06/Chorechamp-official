package com.example.chorechamp.chore;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ChoreControllerApplicationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private ChoreService choreService;

    @Test
    void getAll_returns_200_and_list_json() throws Exception {
        // Arrange
        ChoreDto c1 = new ChoreDto();
        c1.setId("c1");
        c1.setTitle("Afwas");
        c1.setPoints(10);

        when(choreService.getAll()).thenReturn(List.of(c1));

        // Act + Assert
        mvc.perform(get("/api/chores"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("c1"))
                .andExpect(jsonPath("$[0].title").value("Afwas"))
                .andExpect(jsonPath("$[0].points").value(10));

        verify(choreService).getAll();
    }
}
