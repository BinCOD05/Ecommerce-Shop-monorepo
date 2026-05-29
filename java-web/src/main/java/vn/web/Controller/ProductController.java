package vn.web.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.web.Controller.Request.ProductCreationRequest;
import vn.web.Controller.Request.ProductFilterSearch;
import vn.web.Controller.Request.ProductUpdateRequest;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.ProductDetailResponse;
import vn.web.Controller.Response.ProductSummaryResponse;
import vn.web.Services.ProductService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Danh sách sản phẩm (public, có filter + phân trang)")
    @GetMapping
    public ApiResponse<PageResponse<ProductSummaryResponse>> getProducts(
            @ModelAttribute ProductFilterSearch request,
            @PageableDefault(size = 30, direction = Sort.Direction.ASC) Pageable pageable) {
        return ApiResponse.<PageResponse<ProductSummaryResponse>>builder()
                .status(HttpStatus.OK.value())
                .result(productService.getProductList(request, pageable))
                .build();
    }

    @Operation(summary = "Chi tiết sản phẩm (public)")
    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getProductDetail(@PathVariable Long id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết sản phẩm thành công")
                .result(productService.getProductDetail(id))
                .build();
    }

    @Operation(summary = "Tạo sản phẩm (Admin) — multipart/form-data")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ProductDetailResponse> createProduct(
            @RequestPart("product") ProductCreationRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        if (files != null && request.getImages() != null && files.size() != request.getImages().size()) {
            throw new RuntimeException("Số file ảnh và metadata ảnh không khớp nhau");
        }
        return ApiResponse.<ProductDetailResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo sản phẩm thành công")
                .result(productService.createProduct(request, files))
                .build();
    }

    @Operation(summary = "Cập nhật sản phẩm (Admin)")
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<ProductDetailResponse> updateProduct(
            @RequestBody ProductUpdateRequest request, @PathVariable Long id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật sản phẩm thành công")
                .result(productService.updateProduct(request, id))
                .build();
    }

    @Operation(summary = "Xóa sản phẩm / ẩn (Admin)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm thành công")
                .build();
    }
}
