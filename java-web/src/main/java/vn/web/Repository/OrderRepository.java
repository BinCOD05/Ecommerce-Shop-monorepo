package vn.web.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.web.Model.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order , Long> {
    List<Order> findByUserId(long id);

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
