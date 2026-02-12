package lk.library_system.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.library_system.Entity.MembersEntity;

public interface MemeberDao extends JpaRepository<MembersEntity, Integer> {
    @Query(value = "SELECT lpad(max(m.membercode) + 1 , 8, '26000000') FROM library_system.members as m;", nativeQuery = true)
    String getNextMemberCode();
}
