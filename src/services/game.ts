
import { OpenAPIRoute, contentJson } from 'chanfana';
import { z } from 'zod';
import { type Context } from 'hono';

export class GameEndpoint extends OpenAPIRoute {
    schema = {
        request: {
            body: contentJson(z.object({
                username: z.string().min(3).max(20),
                password: z.string().min(8),
                email: z.string().email(),
                fullName: z.string().optional(),
                age: z.number().int().positive().optional(),
            })),
        },
        responses: {
            // ... responses
        },
    };

    async handle(c: Context) {
        const data = await this.getValidatedData<typeof this.schema>();
        const userDetails = data.body; // Type-safe access to validated body

        // ... logic to create a user ...
        return { message: 'User created successfully' };
    }
}