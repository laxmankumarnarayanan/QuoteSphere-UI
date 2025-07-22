import React from 'react';
import Layout from '../../components/Layout/Layout';
import { DealCreationLayer } from './DealCreationLayer';

const DealCreationPage: React.FC = () => {
  return (
    <Layout currentPath={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Create Deal', href: '/deal-creation' }
    ]}>
      <DealCreationLayer />
    </Layout>
  );
};

export default DealCreationPage; 