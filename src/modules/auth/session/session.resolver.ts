import { Context, Mutation, Resolver, Args } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../models/user.model';
import { GqlContext } from 'src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {
  }

  @Mutation(() => UserModel, {name: "login"})
  public async login(@Context() {req}: GqlContext, @Args("data") input: LoginInput ) {
    return this.sessionService.login(req, input)
  }

  @Mutation(() => Boolean, {name: "logout"})
  public async logout(@Context() {req}: GqlContext) {
    return this.sessionService.logout(req)
  }
}
