import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/lucia';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';


export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/home');
	}
	return {
		form: await superValidate(zod(loginSchema)),
	};
};

export const actions: Actions = {
    login: async (event) => {
        const form = await superValidate(event, zod(loginSchema))
        if(!form.valid) {
            return fail(400, {
                form
            })
        }

        const {email, password} = form.data

        if (!email || !password) {
			return fail(400, { message: 'Ops, o campo de usuário ou senha está vazio' });
		}

        const results = await db.select().from(table.user).where(eq(table.user.email, email));



		try {
			const existingUser = results.at(0);
			if (!existingUser) {
				return fail(400, { message: 'Username ou email incorreto, talvez você queira criar uma conta?'})};
			
			const validPassword = await verify(existingUser.passwordHash, password, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1,
				});
				if (!validPassword) {
					return fail(400, { message: 'Incorrect username or password' });
				}
	
			if (existingUser && validPassword) {
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, existingUser.id);
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
				return {
					form
				};
			}
		} catch (err) {
			console.error(err)
			return {
				form,
			}
		}
    }
}