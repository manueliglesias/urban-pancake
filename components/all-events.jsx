import gql from "graphql-tag";
import { graphql } from "react-apollo";
import ViewEvent from "./view-event";

class AllEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.getDefaultState();
    }

    getDefaultState() {
        return {
            selectedEvent: null
        };
    }

    handleClick(selectedEvent) {
        this.setState({ selectedEvent });
    }

    handleDeselectClick(selectedEvent) {
        this.setState({ selectedEvent: null });
    }

    render() {
        const { items = [] } = this.props;
        const { selectedEvent } = this.state;

        return (
            <div>
                <h1>Events</h1>
                <button disabled={!selectedEvent} onClick={this.handleDeselectClick.bind(this)}>De-select</button>
                <ul>
                    {items.map(i => <li key={i.id} onClick={this.handleClick.bind(this, i.id)}>{i.name}</li>)}
                </ul>
                <ViewEvent id={selectedEvent} />
            </div>
        );
    }

}

const query = gql`query Q {
  listEvents {
    items {
      id
      name
    }
  }
}`;

export default graphql(query, {
    props: (props) => ({
        items: props.data.listEvents ? props.data.listEvents.items : []
    }),
})(AllEvents);