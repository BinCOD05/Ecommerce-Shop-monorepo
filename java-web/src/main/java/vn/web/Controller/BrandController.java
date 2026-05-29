package vn.web.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Model.Brand;
import vn.web.Repository.BrandRepository;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandRepository brandRepository;

    @GetMapping
    public ApiResponse<List<Brand>> getAllBrands() {
        List<Brand> list = brandRepository.findAll();
        return ApiResponse.<List<Brand>>builder()
                .result(list)
                .build();
    }
}