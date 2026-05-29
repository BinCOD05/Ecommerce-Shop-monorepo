package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.web.Model.UserEntity;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserEntity , Long> , JpaSpecificationExecutor<UserEntity> {
    Optional<UserEntity> findByUsername(String userName);

    Optional<UserEntity> findById (long id);

    Optional<UserEntity> findByEmail(String email);


}
