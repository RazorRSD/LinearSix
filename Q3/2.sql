USE testDb;
SELECT `name` FROM `group` g 
	LEFT JOIN `groupmembership` gm ON g.id = gm.groupID 
    WHERE gm.id IS NULL AND g.name LIKE "TEST-%";
    