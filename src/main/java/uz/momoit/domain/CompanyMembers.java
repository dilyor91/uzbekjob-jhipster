package uz.momoit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import uz.momoit.domain.enumeration.MembersTypeEnum;

/**
 * A CompanyMembers.
 */
@Entity
@Table(name = "company_members")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompanyMembers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "business_reg_num")
    private String businessRegNum;

    @Column(name = "represantitive_name")
    private String represantitiveName;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "subscriber_name")
    private String subscriberName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "members_type")
    private MembersTypeEnum membersType;

    @JsonIgnoreProperties(value = { "authorities", "persons", "companyMembers" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Users userId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompanyMembers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public CompanyMembers companyName(String companyName) {
        this.setCompanyName(companyName);
        return this;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getBusinessRegNum() {
        return this.businessRegNum;
    }

    public CompanyMembers businessRegNum(String businessRegNum) {
        this.setBusinessRegNum(businessRegNum);
        return this;
    }

    public void setBusinessRegNum(String businessRegNum) {
        this.businessRegNum = businessRegNum;
    }

    public String getRepresantitiveName() {
        return this.represantitiveName;
    }

    public CompanyMembers represantitiveName(String represantitiveName) {
        this.setRepresantitiveName(represantitiveName);
        return this;
    }

    public void setRepresantitiveName(String represantitiveName) {
        this.represantitiveName = represantitiveName;
    }

    public String getCompanyAddress() {
        return this.companyAddress;
    }

    public CompanyMembers companyAddress(String companyAddress) {
        this.setCompanyAddress(companyAddress);
        return this;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getSubscriberName() {
        return this.subscriberName;
    }

    public CompanyMembers subscriberName(String subscriberName) {
        this.setSubscriberName(subscriberName);
        return this;
    }

    public void setSubscriberName(String subscriberName) {
        this.subscriberName = subscriberName;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public CompanyMembers phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public MembersTypeEnum getMembersType() {
        return this.membersType;
    }

    public CompanyMembers membersType(MembersTypeEnum membersType) {
        this.setMembersType(membersType);
        return this;
    }

    public void setMembersType(MembersTypeEnum membersType) {
        this.membersType = membersType;
    }

    public Users getUserId() {
        return this.userId;
    }

    public void setUserId(Users users) {
        this.userId = users;
    }

    public CompanyMembers userId(Users users) {
        this.setUserId(users);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompanyMembers)) {
            return false;
        }
        return id != null && id.equals(((CompanyMembers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompanyMembers{" +
            "id=" + getId() +
            ", companyName='" + getCompanyName() + "'" +
            ", businessRegNum='" + getBusinessRegNum() + "'" +
            ", represantitiveName='" + getRepresantitiveName() + "'" +
            ", companyAddress='" + getCompanyAddress() + "'" +
            ", subscriberName='" + getSubscriberName() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", membersType='" + getMembersType() + "'" +
            "}";
    }
}
