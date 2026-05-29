package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.web.Model.AddressEntity;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity , Long > {

    List<AddressEntity> findByUserId(long userid);

    Optional<AddressEntity> findByIdAndUserId(long id , long userId);

    Optional<AddressEntity> findByUserIdAndDefaultAddressTrue(long userId);

    long countByUserId(long userId);


    @Modifying
    @Query(" UPDATE AddressEntity a SET a.defaultAddress = false where a.user.id = :userId ")
    void removeAllDefault(long userId);
}
