package com.example.chorechamp.household;

import com.example.chorechamp.household.HouseholdMembershipController.CreateHouseholdRequest;
import com.example.chorechamp.household.HouseholdMembershipController.CreateHouseholdResponse;
import com.example.chorechamp.household.HouseholdMembershipController.UserDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class HouseholdMembershipControllerApplicationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private HouseholdMembershipService membershipService;

    @Test
    void createHousehold_returns_201_and_response_contains_household_and_user() throws Exception {
        // Arrange
        String userId = "u1";
        CreateHouseholdRequest req = new CreateHouseholdRequest("Mijn huishouden");

        HouseholdDto householdDto = new HouseholdDto();
        householdDto.setId("h1");
        householdDto.setName("Mijn huishouden");

        UserDto userDto = new UserDto("u1", "john", "john@test.com", "ADMIN");

        CreateHouseholdResponse resp = new CreateHouseholdResponse(householdDto, userDto);

        when(membershipService.createHouseholdForUserAndPromoteAdmin(eq(userId), eq("Mijn huishouden")))
                .thenReturn(resp);

        // Act + Assert
        mvc.perform(post("/api/household-membership/{userId}/create", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.household.id").value("h1"))
                .andExpect(jsonPath("$.household.name").value("Mijn huishouden"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));

        verify(membershipService).createHouseholdForUserAndPromoteAdmin(eq(userId), eq("Mijn huishouden"));
    }

    @Test
    void createHousehold_returns_400_when_name_blank() throws Exception {
        // Arrange
        String userId = "u1";
        CreateHouseholdRequest req = new CreateHouseholdRequest("   ");

        // Act + Assert
        mvc.perform(post("/api/household-membership/{userId}/create", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());

        verify(membershipService, never()).createHouseholdForUserAndPromoteAdmin(anyString(), anyString());
    }
}
