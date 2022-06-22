import { supabase } from '@lib/supabaseConfig';
import { trpc } from '../utils/trpc';

const ExamplePage = () => {
  const user = supabase.auth.user();
  if (user) {
    const userData = trpc.useQuery(['all']);
    const updatedData = JSON.stringify(
      userData.data,
      (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
    );
    if (!userData.data) {
      return <div><p>Loading...</p></div>;
    }
    return (
      <div>
        <p>{updatedData}</p>
      </div>
    );
  }
  return <div><p>Loading...</p></div>;
};

export default ExamplePage;
