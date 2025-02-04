package groups;

import org.junit.jupiter.api.Test;
import ru.mycrg.gis_service.entity.Group;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.gis_service.service.GroupValidator.isInvalidGroupRelation;

class GroupsTest {

    @Test
    void shouldCheckLayersGroups() {
        List<Group> groups = prepareGroups();

        Group rootGroup = new Group();

        Group sameIdGroup = new Group();
        sameIdGroup.setId(314);
        sameIdGroup.setParentId(314L);

        Group notExistParentGroup = new Group();
        notExistParentGroup.setId(1);
        notExistParentGroup.setParentId(314L);

        Group cyclingGroup = new Group();
        cyclingGroup.setId(2);
        cyclingGroup.setParentId(5L);

        Group correctGroup = new Group();
        correctGroup.setId(6);
        correctGroup.setParentId(5L);

        Group newGroup = new Group();
        newGroup.setParentId(3L);

        assertFalse(isInvalidGroupRelation(rootGroup, groups));
        assertTrue(isInvalidGroupRelation(sameIdGroup, groups));
        assertTrue(isInvalidGroupRelation(notExistParentGroup, groups));
        assertFalse(isInvalidGroupRelation(correctGroup, groups));
        assertFalse(isInvalidGroupRelation(newGroup, groups));
        assertTrue(isInvalidGroupRelation(cyclingGroup, groups));
    }

    private List<Group> prepareGroups() {
        Group root = new Group();
        root.setId(1);

        Group level11 = new Group();
        level11.setId(2);
        level11.setParentId(1L);

        Group level12 = new Group();
        level12.setId(3);
        level12.setParentId(1L);

        Group level21 = new Group();
        level21.setId(4);
        level21.setParentId(2L);

        Group level31 = new Group();
        level31.setId(5);
        level31.setParentId(4L);

        return Arrays.asList(root, level11, level12, level21, level31);
    }
}
