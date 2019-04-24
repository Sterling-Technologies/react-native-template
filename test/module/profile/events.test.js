import app from '@library/AppHandler';
import ProfileModule from '@module/profile/register';

app.register(ProfileModule);

test('Profile search event', async () => {
  // let profiles = await app.method('profile-search', {dev: true});
  //
  // expect(profiles.results).toBeDefined();
  // expect(profiles.total).toBeDefined();
});

test('Profile recover event', async () => {
  // let data = {
  //   dev: true,
  //   'profile_id': 2,
  //   'profile_email': 'april@mailinator.com',
  //   'profile_phone': 123
  // };
  //
  // let profile = await app.method('profile-recover', data);
  //
  // expect(profile.profile_id).toBe(2);
  // expect(profile.profile_email).toBe('april@mailinator.com');
});
