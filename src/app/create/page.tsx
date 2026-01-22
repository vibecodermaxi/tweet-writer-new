import { redirect } from 'next/navigation';
import { CreateWizard } from '@/components/create/create-wizard';
import { getProfile } from '@/lib/actions/profile';

export default async function CreatePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect('/profile');
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create a Tweet</h1>
        <p className="text-muted-foreground mt-1">
          Let AI help you craft the perfect tweet
        </p>
      </div>

      <CreateWizard />
    </div>
  );
}
