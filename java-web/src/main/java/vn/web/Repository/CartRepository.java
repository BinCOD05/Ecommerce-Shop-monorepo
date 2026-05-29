package vn.web.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.web.Model.Cart;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart ,Long>  {

    @Query("SELECT c FROM Cart c " + " LEFT JOIN FETCH c.cartItemSet ci "
            + " LEFT JOIN FETCH ci.product "
            + " WHERE c.user.id = :id")
    Optional<Cart> findByUserId(@Param("id") long id);
}
