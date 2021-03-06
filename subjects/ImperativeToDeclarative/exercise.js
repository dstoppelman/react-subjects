////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// This Modal, even though its a React component, has an imperative API to
// open and close it. Can you convert it to a declarative API?
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import $ from 'jquery'
import 'bootstrap-webpack'

class Modal extends React.Component {
  bootstrapCloseModalEvent = 'hidden.bs.modal'

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  showOrHide() {
    $( findDOMNode( this ) ).modal( this.props.isOpen ? 'show' : 'hide' )
  }

  componentDidMount() {
    this.showOrHide()

    //sync state in case the modal was closed from overlay click
    $( findDOMNode( this) ).on( this.bootstrapCloseModalEvent, () => {
      if ( this.props.onClose ) {
        this.props.onClose()
      }
    })
  }

  componentWillUnmount() {
    $( findDOMNode( this) ).unbind( this.bootstrapCloseModalEvent );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      this.showOrHide()
    }
  }

  render() {
    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  state = { isModalOpen: false }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    return (
      <div className="container">
        <h1>Let’s make bootstrap modal declarative</h1>

        <button
          className="btn btn-primary"
          onClick={ this.openModal }
        >open modal</button>

        {/*<pre>{ JSON.stringify( this.state, null, 2 ) }</pre>*/}

        <Modal
          isOpen={ this.state.isModalOpen }
          onClose= { this.closeModal }
          title="Declarative is better"
        >
          <p>Calling methods on instances is a FLOW not a STOCK!</p>
          <p>It’s the dynamic process, not the static program in text space.</p>
          <p>You have to experience it over time, rather than in snapshots of state.</p>
          <button
            onClick={ this.closeModal }
            type="button"
            className="btn btn-default"
          >Close</button>
        </Modal>

      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
