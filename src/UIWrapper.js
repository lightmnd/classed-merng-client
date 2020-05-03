import React, { Component } from 'react';

function UIWrapper({ children }) {
	return <div style={{padding: "25px 10px"}}>{children}</div>;
}

export default UIWrapper;
