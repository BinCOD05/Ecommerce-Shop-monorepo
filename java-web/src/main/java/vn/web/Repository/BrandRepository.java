package vn.web.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.web.Model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand , Long> {
}
