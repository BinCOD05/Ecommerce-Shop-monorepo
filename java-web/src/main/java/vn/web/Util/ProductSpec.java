package vn.web.Util;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import vn.web.Controller.Request.ProductFilterSearch;
import vn.web.Model.Product;

import java.util.ArrayList;
import java.util.List;


public class ProductSpec {
    public static Specification<Product> search(ProductFilterSearch req){

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if(req.getKeyword() != null ){
                String key =  "%" + req.getKeyword().toLowerCase().trim() + "%";
                Predicate hasKey = cb.like(cb.lower(root.get("name")) , key);
                predicates.add(hasKey);
            }

            if(req.getCategoryId() != null ){
                Predicate hasCategory = cb.equal(root.get("category").get("id") , req.getCategoryId());
                predicates.add(hasCategory);
            }

            if(req.getBrandId() != null){
                Predicate hasBrand = cb.equal(root.get("brand").get("id"), req.getBrandId());
                predicates.add(hasBrand);

            }

            if(req.getMinPrice() != null ){
                Predicate hasMinPrice = cb.greaterThanOrEqualTo(root.get("price") , req.getMinPrice());
                predicates.add(hasMinPrice);

            }

            if(req.getMaxPrice() != null ){
                Predicate hasMaxPrice = cb.lessThanOrEqualTo(root.get("price") , req.getMinPrice());
                predicates.add(hasMaxPrice);

            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

    }
}
