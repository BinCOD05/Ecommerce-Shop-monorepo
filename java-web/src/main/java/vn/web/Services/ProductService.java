package vn.web.Services;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.web.Controller.Request.ProductCreationRequest;
import vn.web.Controller.Request.ProductFilterSearch;
import vn.web.Controller.Request.ProductUpdateRequest;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.ProductDetailResponse;
import vn.web.Controller.Response.ProductSummaryResponse;
import vn.web.Model.Product;

import java.util.List;

public interface ProductService {
   ProductDetailResponse createProduct(ProductCreationRequest req , List<MultipartFile> files);

   ProductDetailResponse getProductDetail(long id) ;

   PageResponse<ProductSummaryResponse> getProductList(ProductFilterSearch req , Pageable pageable);

   ProductDetailResponse updateProduct(ProductUpdateRequest req , long id);

   void deleteProduct(long id);

}
