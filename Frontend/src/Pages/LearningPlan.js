import React, { useState, useEffect } from 'react';
import '../style/LearningPlan.css';

const LearningPlan = () => {
  const [planData, setPlanData] = useState({
    title: '',
    subject: '',
    topics: '',
    resources: '',
    date: '',
    savePlan: false
  });

  const [errors, setErrors] = useState({});
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const programmingLanguages = ['Follow exercise', 'Follow diet', 'take healthy foods', 'Maintain body weight'];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        console.error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTopicSelect = (topic) => {
    setPlanData(prevState => ({
      ...prevState,
      topics: topic
    }));
    setIsTopicsOpen(false);
  };

  const toggleDropdown = () => {
    setIsTopicsOpen(!isTopicsOpen);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!planData.title.trim()) newErrors.title = 'Title is required';
    if (!planData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!planData.topics.trim()) newErrors.topics = 'Topic selection is required';
    if (!planData.resources.trim()) newErrors.resources = 'Resources cannot be empty';
    if (!planData.date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(planData.date)) {
      newErrors.date = 'Invalid date format (MM/DD/YYYY)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const [month, day, year] = planData.date.split('/');
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const payload = {
        title: planData.title,
        subject: planData.subject,
        topics: planData.topics,
        resources: planData.resources,
        date: isoDate,
        savePlan: planData.savePlan
      };

      const url = editingId
        ? `http://localhost:8080/api/plans/${editingId}`
        : 'http://localhost:8080/api/plans';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setPlanData({
          title: '',
          subject: '',
          topics: '',
          resources: '',
          date: '',
          savePlan: false
        });
        setEditingId(null);
        fetchPlans();
      } else {
        console.error('Failed to save plan');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (plan) => {
    // Convert YYYY-MM-DD to MM/DD/YYYY
    const [year, month, day] = plan.date.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    setPlanData({
      title: plan.title,
      subject: plan.subject,
      topics: plan.topics,
      resources: plan.resources,
      date: formattedDate,
      savePlan: plan.savePlan
    });

    setEditingId(plan.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/plans/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPlans();
      } else {
        console.error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div className="lpl__container">
      <div className="lpl__form-container">
        <h2 className="lpl__form-title">Learning Plan Sharing</h2>

        <form onSubmit={handleSubmit} className="lpl__form">
          <div className="lpl__form-row">
            <input
              type="text"
              name="title"
              value={planData.title}
              onChange={handleChange}
              placeholder="Plan Title"
              className="lpl__input"
            />
            {errors.title && <p className="error">{errors.title}</p>}

            <input
              type="text"
              name="subject"
              value={planData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="lpl__input"
            />
            {errors.subject && <p className="error">{errors.subject}</p>}
          </div>

          <div className="lpl__form-row">
            <div className="lpl__dropdown">
              <div
                className="lpl__dropdown-header"
                onClick={toggleDropdown}
              >
                <input
                  type="text"
                  name="topics"
                  value={planData.topics}
                  readOnly
                  placeholder="Topics"
                  className="lpl__input lpl__dropdown-input"
                />
                <span className="lpl__dropdown-arrow">&#9662;</span>
              </div>
              {isTopicsOpen && (
                <ul className="lpl__dropdown-menu">
                  {programmingLanguages.map((language, index) => (
                    <li
                      key={index}
                      className="lpl__dropdown-item"
                      onClick={() => handleTopicSelect(language)}
                    >
                      {language}
                    </li>
                  ))}
                </ul>
              )}
              {errors.topics && <p className="error">{errors.topics}</p>}
            </div>
          </div>

          <div className="lpl__form-row">
            <textarea
              name="resources"
              value={planData.resources}
              onChange={handleChange}
              placeholder="Add Resource Links Or References..."
              className="lpl__textarea"
            ></textarea>
            {errors.resources && <p className="error">{errors.resources}</p>}
          </div>

          <div className="lpl__form-row">
            <input
              type="text"
              name="date"
              value={planData.date}
              onChange={handleChange}
              placeholder="MM/DD/YYYY"
              className="lpl__input"
            />
            {errors.date && <p className="error">{errors.date}</p>}
          </div>

          <div className="lpl__form-row lpl__checkbox-row">
            <label className="lpl__checkbox-label">
              <input
                type="checkbox"
                name="savePlan"
                checked={planData.savePlan}
                onChange={handleChange}
                className="lpl__checkbox"
              />
              Save Plan
            </label>
          </div>

          <div className="lpl__form-buttons">
            <button type="submit" className="lpl__button lpl__button-primary">
              {editingId ? 'Update Plan' : 'Post Plan'}
            </button>
            <button
              type="button"
              className="lpl__button lpl__button-secondary"
              onClick={() => {
                setPlanData({
                  title: '',
                  subject: '',
                  topics: '',
                  resources: '',
                  date: '',
                  savePlan: false
                });
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="lpl__posted-plans">
        <h3>Posted Learning Plans</h3>
        {plans.length === 0 ? (
          <p>No plans posted yet.</p>
        ) : (
          <ul className="lpl__plan-list">
            {plans.map((plan, index) => (
              <li key={plan.id || index} className="lpl__plan-item">
                <h4>{plan.title}</h4>
                <p><strong>Subject:</strong> {plan.subject}</p>
                <p><strong>Topic:</strong> {plan.topics}</p>
                <p><strong>Resources:</strong> {plan.resources}</p>
                <p><strong>Date:</strong> {plan.date}</p>
                <div className="lpl__plan-buttons">
                  <button onClick={() => handleEdit(plan)} className="lpl__button-edit">Edit</button>
                  <button onClick={() => handleDelete(plan.id)} className="lpl__button-delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LearningPlan;


//