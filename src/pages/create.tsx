import { supabase } from '@lib/supabaseConfig';
import { trpc } from '../utils/trpc';

const Create = () => {
  const user = supabase.auth.user();
  if (user) {
    const addProject = trpc.useMutation(['add-project']);
    if (!addProject.isError) {
      return (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addProject.mutate({
                name: 'New Project',
              });
            }}
          >
            Add
          </button>
        </div>
      );
    }
  }
  return (
    <div>
      <button type="button">Add</button>
    </div>
  );
};

export default Create;
