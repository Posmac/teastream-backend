import { Args, Query, Resolver } from '@nestjs/graphql'
import { CategoriesService } from './categories.service'
import { CategoryModel } from './models/category.models'

@Resolver('Category')
export class CategoriesResolver {
	public constructor(private readonly categoryService: CategoriesService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	public async findAll() {
		return this.categoryService.findAll()
	}

	@Query(() => [CategoryModel], { name: 'findRandomCategories' })
	public async findRandom() {
		return this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategoryBySlug' })
	public async findBySlug(@Args('slug') slug: string) {
		return this.categoryService.findBySlug(slug)
	}
}
