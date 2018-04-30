import gql from "graphql-tag";
import { graphql } from "react-apollo";

class ViewEvent extends React.Component {

    activeSubscription;

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { subscribe, event, id, loading } = this.props;

        if (loading) {
            return;
        }

        if (this.activeSubscription) {
            this.activeSubscription();
            this.activeSubscription = null;
        }

        if (id && event) {
            this.activeSubscription = subscribe();
        }
    }

    componentWillUnmount() {
        if (this.activeSubscription) {
            this.activeSubscription();
            this.activeSubscription = null;
        }
    }

    render() {
        const { event, loading, id } = this.props;

        if (loading) {
            return <div>Loading...</div>
        }

        return id && (
            <div>
                <h2>One event</h2>
                <pre>{JSON.stringify(event, null, 2)}</pre>
            </div>
        );
    }

}

const query = gql`query Q($id: ID!) {
  getEvent(
    id: $id
  ) {
    id
    name
    where
    when
    description
    comments {
      items {
        content
        createdAt
      }
    }
  }
}`;

const subscription = gql`subscription S($eventId: String!) {
  subscribeToEventComments(
    eventId: $eventId
  ) {
    eventId
    commentId
    content
    createdAt
  }
}`;

export default graphql(query, {
    props: ({ data: { getEvent: event, loading, subscribeToMore }, ownProps: { id: eventId } }) => ({
        loading: eventId && loading,
        event: eventId && event,
        subscribe: () => eventId && subscribeToMore({
            document: subscription,
            variables: { eventId },
            updateQuery: (prev, { subscriptionData: { data: { subscribeToEventComments: comment } } }) => {
                console.log(prev);

                return {
                    ...prev,
                    getEvent: {
                        ...prev.getEvent,
                        comments: { __typename: 'CommentConnection', items: [...prev.getEvent.comments.items, comment] }
                    },
                };
            }
        })
    })
})(ViewEvent);
