package vn.web.Converter;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.web.Controller.Response.CategoryResponse;
import vn.web.Controller.Response.CategoryTreeResponse;
import vn.web.Model.Category;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "parent.id" , target = "parentId")
    CategoryResponse toDTOResponse(Category category);

    CategoryTreeResponse toTreeDTO(Category category);

    List<CategoryResponse> toTreeCategoryList(List<Category> categories);
}
