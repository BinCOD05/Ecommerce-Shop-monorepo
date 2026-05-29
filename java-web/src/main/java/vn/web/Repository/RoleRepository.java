package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.web.Common.RoleType;
import vn.web.Model.Role;

import java.util.Optional;


@Repository
public interface RoleRepository extends JpaRepository<Role , Integer> {
    Optional<Role> findByName(RoleType name);
}
