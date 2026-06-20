import { PrismLight as Prism } from 'react-syntax-highlighter';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

Prism.registerLanguage('bash', bash);
Prism.registerLanguage('python', python);
Prism.registerLanguage('c', c);
Prism.registerLanguage('cpp', cpp);
Prism.registerLanguage('java', java);
Prism.registerLanguage('javascript', javascript);
Prism.registerLanguage('typescript', typescript);
Prism.registerLanguage('json', json);
Prism.registerLanguage('css', css);
Prism.registerLanguage('markdown', markdown);
Prism.registerLanguage('yaml', yaml);
Prism.registerLanguage('gitignore', bash);

// eslint-disable-next-line react-refresh/only-export-components
export { Prism, oneLight, oneDark };
