package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.web.Model.CartItem;



@Repository
public interface CartItemRepository extends JpaRepository<CartItem , Long> {
}
