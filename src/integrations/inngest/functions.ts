import { inngest } from './client'

export const helloWorld = inngest.createFunction(
    {
      id: 'hello-world',
      triggers: [{ event: 'test/hello.world' }],
    },
    async ({ event, step }) => {
      await step.sleep('wait-a-moment', '1s')
      const email = (event.data as { email?: string } | null)?.email ?? 'world'
      return { message: `Hello ${email}!` }
    },
  )