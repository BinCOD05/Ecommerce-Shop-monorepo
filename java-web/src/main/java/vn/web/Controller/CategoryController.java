package vn.web.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Model.Category;
import vn.web.Repository.CategoryRepository;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ApiResponse<List<Category>> getAllCategories() {
        List<Category> list = categoryRepository.findAll();
        return ApiResponse.<List<Category>>builder()
                .result(list)
                .build();
    }
}