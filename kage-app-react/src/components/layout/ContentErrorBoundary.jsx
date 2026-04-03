import { Component } from "react";

export default class ContentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: "#fff", borderRadius: 12, padding: 18, color: "#6b7280" }}>
          Inhalt konnte nicht geladen werden. Bitte Seite erneut im Menü auswählen.
        </div>
      );
    }
    return this.props.children;
  }
}
