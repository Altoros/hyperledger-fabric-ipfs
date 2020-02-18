import React from 'react';

export class Footer extends React.Component {
  render() {
    const now = new Date().getFullYear();
    return (
      <footer className="row-custom footer">
        <div className="container">
          <p className="text-white text-center">
            &copy; {now} Altoros. All rights reserved
          </p>
        </div>
      </footer>
    );
  }
}
