import {promises as fs} from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '..');

async function cleanupDocs() {
    const readmePath = path.join(root, 'README.md');
    // Remove breadcrumbs from README
    await fs.writeFile(
        readmePath,
        (await fs.readFile(readmePath, 'utf8')).replace(/^css-selector-parser \/ \[Exports].*\n\n/, '')
    );
    const astFactoryPath = path.join(root, 'docs', 'interfaces', 'AstFactory.md');
    await fs.writeFile(
        astFactoryPath,
        (await fs.readFile(astFactoryPath, 'utf8'))
            .replace(/## Hierarchy[\s\S]*?#/, '#')
            .replace(/#### Inherited from\n\n.*\n/g, '')
    );
}

cleanupDocs().catch(console.error);
