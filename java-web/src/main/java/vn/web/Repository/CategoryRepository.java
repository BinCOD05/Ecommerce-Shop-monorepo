package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.web.Model.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
}
