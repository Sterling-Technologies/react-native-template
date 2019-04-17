import SqlResource from '@library/sql/resources/ExpoResource'
import ProfileModule from '@module/profile/register'
import HomeScreen from '@screen/home/register'
import OnBoardingScreen from '@screen/onboarding/register'

import app from '@library/AppHandler'

export default app
    .setDatabase(new SqlResource('test'))
    .register(ProfileModule)
    .register(HomeScreen)
    // .register(OnBoardingScreen)
    .addLogger((...args) => {
        console.log(...args)
    })
    .start()
