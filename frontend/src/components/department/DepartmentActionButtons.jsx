
import React from 'react';
import Button from '../common/Button';

const DepartmentActionButtons = ({ status, onApprove, onReject, onResolve, onEscalate }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {status === 'Pending' && (
        <>
          <Button variant="primary" onClick={onApprove}>
            Approve & Start Work
          </Button>
          <Button variant="danger" onClick={onReject}>
            Reject
          </Button>
        </>
      )}

      {status === 'In Progress' && (
        <Button variant="primary" onClick={onResolve}>
          Mark as Resolved
        </Button>
      )}

      <Button variant="outline" onClick={onEscalate}>
        Escalate to Higher Department
      </Button>
    </div>
  );
};

export default DepartmentActionButtons;