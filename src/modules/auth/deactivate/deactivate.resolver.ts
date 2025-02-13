import { Mutation, Resolver, Context, Args } from '@nestjs/graphql';
import { DeactivateService } from './deactivate.service';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { AuthModel } from '../account/models/auth.model';
import { GqlContext } from 'src/shared/types/gql-context.types';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { User } from 'prisma/generated';
import { Authorized } from 'src/shared/decorators/authorized.decoratos';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {

  }

  @Authorization()
	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	public async deactivate(
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivate(req, input, user, userAgent)
	}
}
