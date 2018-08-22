import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class Index extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Index</h3>

          <Link route="/code-splitting">
            <a>
              here
            </a>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default Index;