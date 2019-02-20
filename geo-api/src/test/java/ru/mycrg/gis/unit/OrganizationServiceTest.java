package ru.mycrg.gis.unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ru.mycrg.gis.dto.OrganizationUpdateDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.enums.OrganizationStatus;
import ru.mycrg.gis.exceptions.OrganizationNotFoundException;
import ru.mycrg.gis.repository.OrganizationRepository;
import ru.mycrg.gis.repository.UserRepository;
import ru.mycrg.gis.service.OrganizationService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

public class OrganizationServiceTest {

    @InjectMocks
    private OrganizationService organizationService;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private UserRepository userRepository;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldFindAllOrganization() {
        ArrayList<Organization> organizations = new ArrayList<>();
        organizations.add(new Organization());

        when(organizationRepository.findAll()).thenReturn(organizations);

        // ACT
        Iterable<Organization> result = organizationService.findAll();

        // ASSERT
        assertEquals(1, List.of(result).size());
    }

    @Test
    public void shouldGetOrganizationById() {
        long orgId = 1L;
        Organization organization = new Organization();

        when(organizationRepository.findById(orgId)).thenReturn(Optional.of(organization));

        // ASSERT
        assertNotNull(organizationService.findById(orgId));
    }

    @Test
    public void shouldDeleteOrganizationById() {
        long id = 1L;
        Organization organization = new Organization();

        when(organizationRepository.findById(id)).thenReturn(Optional.of(organization));
        doNothing().when(organizationRepository).deleteById(id);
        doNothing().when(userRepository).deleteById(id);

        // ASSERT
        organizationService.deleteById(id);
    }

    @Test
    public void shouldUpdateOrganization() {
        long orgId = 1L;
        String newName = "newName";
        String newPhone = "newPhone";
        OrganizationUpdateDto updateDto = new OrganizationUpdateDto(newName, newPhone);
        Organization oldOrganization = new Organization("oldName", "oldPhone");
        Organization newOrganization = new Organization(newName, newPhone);

        when(organizationRepository.findById(orgId)).thenReturn(Optional.of(oldOrganization));
        when(organizationRepository.save(oldOrganization)).thenReturn(newOrganization);

        Organization result = organizationService.update(orgId, updateDto);

        // ASSERT
        assertEquals(result.getName(), newName);
        assertEquals(result.getPhone(), newPhone);
        assertEquals(result.getStatus(), OrganizationStatus.NEW);
    }

    @Test(expected = OrganizationNotFoundException.class)
    public void throwExceptionByFoundingNotExistEntity() {
        organizationService.findById(100L);
    }

    @Test(expected = OrganizationNotFoundException.class)
    public void throwExceptionByDeletingNotExistEntity() {
        organizationService.deleteById(100L);
    }

}
