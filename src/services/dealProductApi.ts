export async function addDealProduct(data: any) {
  const response = await fetch('/api/deal-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add DealProduct');
  return response.json();
}

export async function addDealSubProduct(data: any) {
  const response = await fetch('/api/deal-sub-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add DealSubProduct');
  return response.json();
} 