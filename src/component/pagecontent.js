import React from 'react';
import { Panel } from 'rsuite';

class PageContent extends Component {
    render() {
        return (
            <>
                <Panel style={{ background: '#fff' }} {...props} />
            </>
        );
    }

};

export default PageContent;