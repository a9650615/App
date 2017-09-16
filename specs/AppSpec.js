export default function(spec) {
  spec.describe('Login Test', function() {
    spec.it('Router', async function() {
      await spec.exists('Router')
      await spec.exists('Login.Email')
    })
    
    spec.it('Login', async function() {
      await spec.fillIn('Login.Email', 'test@gmail.com')
      await spec.fillIn('Login.Password', 'test')
      await spec.press('Login.LoginButton')
          // await spec.exists('Login.Email')
          // await spec.exists('Login')
    })
  })

  // spec.describe('Login Page', function() {
  //   spec.it('Login', async function() {
  //     // await spec.exists('Login.Email')
  //     // await spec.exists('Login')
  //   })
  // })
}