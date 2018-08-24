import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl';
import pageWithIntl from '../components/PageWithIntl';
import Layout from '../components/Layout';
import { Link } from '../routes';

const { description } = defineMessages({
  description: {
    id: 'description',
    defaultMessage: 'An example app integrating React Intl with Next.js'
  }
})

class Index extends Component {

  render() {
    const { intl } = this.props;
    return (
      <Layout>
        <div>
          <h3>Index</h3>
          <p>{intl.formatMessage(description)}</p>
          <p><FormattedMessage id='greeting' defaultMessage='Hello, World!' /></p>
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

export default pageWithIntl(Index);