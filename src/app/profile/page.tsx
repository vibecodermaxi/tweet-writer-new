import { ProfileForm } from '@/components/profile/profile-form';
import { getProfile } from '@/lib/actions/profile';

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {profile ? 'Edit Profile' : 'Create Profile'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Set up your writing style and preferences for AI-generated tweets
        </p>
      </div>

      <ProfileForm initialData={profile} />
    </div>
  );
}
