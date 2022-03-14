import { Registry } from '@bem-react/di';

import { Form } from '../components/Form/Form';
import { Explorer } from '../components/Explorer/Explorer';
import { FormDialog } from '../components/FormDialog/FormDialog';
import { FormView } from '../components/Form/View/Form-View.composed';
import { FormControl } from '../components/Form/Control/Form-Control.composed';
import { LibraryDocument } from '../components/LibraryDocument/LibraryDocument';
import { LibraryDocumentActions } from '../components/LibraryDocumentActions/LibraryDocumentActions.composed';

export const registry = new Registry({ id: 'common' });

registry.fill({
  Explorer,
  Form,
  FormView,
  FormDialog,
  FormControl,
  LibraryDocument,
  LibraryDocumentActions
});
