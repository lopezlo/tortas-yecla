import { getActiveRestaurants } from '@/lib/actions';
import EvaluationForm from '@/components/EvaluationForm';

export default async function HomePage() {
  const restaurants = await getActiveRestaurants();
  return <EvaluationForm restaurants={restaurants} />;
}
